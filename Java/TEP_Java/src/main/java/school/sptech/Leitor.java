package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.DadosDaPlanilha.*;
import school.sptech.DadosDaPlanilha.Indicadores.Indicador;
import school.sptech.DadosDaPlanilha.Indicadores.IndicadorPorSetor;
import school.sptech.DadosDaPlanilha.Indicadores.MetricasDoPib;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static school.sptech.EnvioBanco.*;
import static school.sptech.Logs.Log.logMensagem;

public class Leitor {

    public void extrairMunicipios(S3Client s3Client, String bucketname, String chave, Integer contador, Integer ano, JdbcTemplate template) {

        //Criando variaveis de lista para mandar dados para o banco.
            List<Municipio> municipios = new ArrayList<>();
            List<Setores> setores = new ArrayList<>();
            List<Indicador> indicadores = new ArrayList<>();



        logMensagem(LocalDateTime.now(), "Debug", "Iniciando Leitura de Arquivo...");

        //
        GetObjectRequest objetoPedido = GetObjectRequest.builder().bucket(bucketname).key(chave).build();
        try (
                //Pegando arquivo
                InputStream arquivo = s3Client.getObject(objetoPedido, ResponseTransformer.toInputStream());
                //E lançando para um workbook e declara como planilha
                Workbook workbook = new XSSFWorkbook(arquivo)
        ) {
            //Pegando a pagina 0 (A primeira) para ler
            Sheet sheet = workbook.getSheetAt(0);


            logMensagem(LocalDateTime.now(), "Debug", "Percorrendo a planilha");
            //Percorre a planilha e passa linha por linha
            for (Row row : sheet) {

                //Condição de pega somente as celulas que tem os dados necessarios
                if (row.getRowNum() > 10 && row.getRowNum() <= 655) {
                    //Condição para pegar somente os municipios de acordo com a regra de negocio
                    if (row.getCell(1).getStringCellValue().equals("RMC") ||
                            row.getCell(1).getStringCellValue().equals("RMSP")) {


                        String CelulaSigla = row.getCell(1).getStringCellValue();
                        String CelulaRegiao = row.getCell(2).getStringCellValue();


                        Regioes regiao = new Regioes( CelulaRegiao, CelulaSigla);


                        logMensagem(LocalDateTime.now(), "Debug", ("Lendo celulas da linha com a regra de negócio aplicada: " + row.getRowNum()));

                        String CelulaNomeMunicipio = row.getCell(0).getStringCellValue().replace("-", " ");

                        Municipio municipio = new Municipio(CelulaNomeMunicipio, regiao);

                        municipios.add(municipio);



                        Setores setor1 = new Setores(1, "Agropecuária");
                        setores.add(setor1);
                        Setores setor2 = new Setores(2, "Indústria");
                        setores.add(setor2);
                        Setores setor3  = new Setores(3, "Administração Pública");
                        setores.add(setor3);
                        Setores setor4 = new Setores(4, "Outros Serviços");
                        setores.add(setor4);

                        if (contador == 0) {

                            //Procura se já foi mandado os dados dos setores para o banco de dados
                            List<Setores> ProcuraSetores = template.query("select * from Setores ", new BeanPropertyRowMapper<>(Setores.class));

                            //Se a lista veio vazio mostra que não tem dados no banco e mandar para o banco
                            if (ProcuraSetores.isEmpty()){
                                //Metodo para envio dos setores para o banco
                                enviandoDBSetores(setores, template);
                            }

                            //Procura se já foi mandado os dados das regiões especificas segundo a sigla e região para o banco de dados
                            List<Regioes> regioes = template.query(
                                    "select * from Regioes where nome_regiao = ? and sigla_regiao = ?",
                                    new BeanPropertyRowMapper<>(Regioes.class),
                                    CelulaRegiao, CelulaSigla
                            );

                            //Se lista veio vazia insere a região e sigla da vez
                            if (regioes.isEmpty()) {
                                template.update("insert into Regioes values(Default, ?, ?)", CelulaRegiao, CelulaSigla);
                            }
                        }


                        //Pega valores dos indicadores
                        Double ValorDaCelulaagro = row.getCell(3).getNumericCellValue();
                        Double ValorDaCelulaindustria = row.getCell(4).getNumericCellValue();
                        Double ValorDaCelulaadmPublica = row.getCell(5).getNumericCellValue();
                        Double ValorDaCelulatotalAdmPublica = row.getCell(6).getNumericCellValue();

                        IndicadorPorSetor indicador1 = new IndicadorPorSetor(ano, municipio ,ValorDaCelulaagro, setor1);
                        IndicadorPorSetor indicador2 = new IndicadorPorSetor(ano, municipio ,ValorDaCelulaindustria, setor2);
                        IndicadorPorSetor indicador3 = new IndicadorPorSetor(ano, municipio ,ValorDaCelulaadmPublica, setor3);
                        IndicadorPorSetor indicador4 = new IndicadorPorSetor(ano, municipio ,ValorDaCelulatotalAdmPublica, setor4);

                        //manda para uma lista de indicadores
                        indicadores.add(indicador1);
                        indicadores.add(indicador2);
                        indicadores.add(indicador3);
                        indicadores.add(indicador4);


                        //Pega dados das metricas do Pib e manda para uma lista de metricas do PIB
                        Double impostos = row.getCell(8).getNumericCellValue();
                        Double pib = row.getCell(9).getNumericCellValue();
                        Double pibPerCapita = row.getCell(10).getNumericCellValue();
                        MetricasDoPib metricaPib = new MetricasDoPib(ano, municipio ,impostos,pib,pibPerCapita);
                        indicadores.add(metricaPib);
                    }
                }
            }
            logMensagem(LocalDateTime.now(), "Debug", "Leitura completa");


            //Como foi a primeira vez vai mandar todos os municipios para o banco de dados
            if (contador == 0){
                //Manda lista de municipios para um metodo de enviar no banco de dados
                enviandoDBMuni(municipios, template);
            }
            //manda as listas para cada metodo especifico
            separandoIndicadores(indicadores, template);

        } catch (IOException e) {
            logMensagem(LocalDateTime.now(), "ERRO", "Erro ao ler Planilha");
        }
    }

    // fim do leitor
}

