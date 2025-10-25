package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Leitor {

    public void extrairMunicipios(S3Client s3Client, String bucketname, String chave, Integer contador, Integer ano) {

        //Instanciando Log.
        Log log = new Log();
        //Instanciando conexao e template
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        //Criando variaveis de lista para mandar dados para o banco.
        //E variavel para contar o municipios segundo a regra e usando para usar em id e fks
        Integer contadorMuni = 0;
        List<Municipio> municipios = new ArrayList<>();
        List<Indicadores> indicadores = new ArrayList<>();
        List<MetricasDoPib> metricasDoPibs = new ArrayList<>();


        log.logMensagem(LocalDateTime.now(), "Debug", "Iniciando Leitura de Arquivo...");

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


            log.logMensagem(LocalDateTime.now(), "Debug", "Percorrendo a planilha");
            //Percorre a planilha e passa linha por linha
            for (Row row : sheet) {

                //Condição de pega somente as celulas que tem os dados necessarios
                if (row.getRowNum() > 10 && row.getRowNum() <= 655) {

                    //Condição para pegar somente os municipios de acordo com a regra de negocio
                    if (row.getCell(1).getStringCellValue().equals("RMC") ||
                            row.getCell(1).getStringCellValue().equals("RMSP")) {
                        //Mudando o valor da variavel que conta os municipios
                        contadorMuni++;


                        log.logMensagem(LocalDateTime.now(), "Debug", ("Lendo celulas da linha com a regra de negócio aplicada: " + row.getRowNum()));


                        //Condiçao para ver se é a primeira planilha que vai ser lida para fazer ações especificas
                        if (contador == 0) {

                            //Pegando nome, sigla e região da linha atual sendo lida
                            String nomeMunicipio = row.getCell(0).getStringCellValue();
                            String sigla = row.getCell(1).getStringCellValue();
                            String regiao = row.getCell(2).getStringCellValue();

                            //Procura se já foi mandado os dados dos setores para o banco de dados
                            List<Setores> setores = template.query("select * from Setores ", new BeanPropertyRowMapper<>(Setores.class));


                            //Se a lista veio vazio mostra que não tem dados no banco e mandar para o banco
                            if (setores.isEmpty()){
                                //Metodo para envio dos setores para o banco
                                enviandoDBSetores();
                            }

                            //Procura se já foi mandado os dados das regiões especificas segundo a sigla e região para o banco de dados
                            List<Regioes> regioes = template.query(
                                    "select * from Regioes where nome_regiao = ? and sigla_regiao = ?",
                                    new BeanPropertyRowMapper<>(Regioes.class),
                                    regiao, sigla
                            );

                            //Se lista veio vazia insere a região e sigla da vez
                            if (regioes.isEmpty()) {
                                template.update("insert into Regioes values(Default, ?, ?)", regiao, sigla);
                            }

                            //Se sigla da vez é igual RMC  entra nessa condição
                            if (row.getCell(1).getStringCellValue().equals("RMC")) {

                                //Constroi um municipio que vai ter o Id, Nome e o Fk da região e manda para uma lista de municipios (Se for RMC a FK é 1)
                                Municipio municipio = new Municipio(contadorMuni, nomeMunicipio, 1);
                                municipios.add(municipio);
                            } else {
                                // Se for outra sigla primero pega com um select o id da região e sigla que foi mandada no banco de dados
                                Integer id = template.queryForObject(
                                        "select idRegioes from Regioes where nome_regiao = ? and sigla_regiao = ?",
                                        Integer.class,
                                        regiao, sigla
                                );
                                //Constroi um municipio que vai ter o Id, Nome e o Fk da região e manda para uma lista de municipios
                                Municipio municipio = new Municipio(contadorMuni, nomeMunicipio, id);
                                municipios.add(municipio);
                            }
                        }


                        //Pega valores dos indicadores
                        Double agro = row.getCell(3).getNumericCellValue();
                        Indicadores indicador1 = new Indicadores(ano, agro, 1 , contadorMuni);
                        Double industria = row.getCell(4).getNumericCellValue();
                        Indicadores indicador2 = new Indicadores(ano, industria, 2 , contadorMuni);
                        Double admPublica = row.getCell(5).getNumericCellValue();
                        Indicadores indicador3 = new Indicadores(ano, admPublica, 3 , contadorMuni);
                        Double totalAdmPublica = row.getCell(6).getNumericCellValue();
                        Indicadores indicador4 = new Indicadores(ano, totalAdmPublica, 4 , contadorMuni);
                        Double totalGeral = row.getCell(7).getNumericCellValue();
                        Indicadores indicador5 = new Indicadores(ano, totalGeral, 5 , contadorMuni);

                        //manda para uma lista de indicadores
                        indicadores.add(indicador1);
                        indicadores.add(indicador2);
                        indicadores.add(indicador3);
                        indicadores.add(indicador4);
                        indicadores.add(indicador5);

                        //Pega dados das metricas do Pib e manda para uma lista de metricas do PIB
                        Double impostos = row.getCell(8).getNumericCellValue();
                        Double pib = row.getCell(9).getNumericCellValue();
                        Double pibPerCapita = row.getCell(10).getNumericCellValue();
                        MetricasDoPib metricaPib = new MetricasDoPib(impostos,pib,pibPerCapita, ano, contadorMuni);
                        metricasDoPibs.add(metricaPib);
                    }
                }
            }
            log.logMensagem(LocalDateTime.now(), "Debug", "Leitura completa");


            //Como foi a primeira vez vai mandar todos os municipios para o banco de dados
            if (contador == 0){
                //Manda lista de municipios para um metodo de enviar no banco de dados
                enviandoDBMuni(municipios);
            }
            //manda as listas para cada metodo especifico
            enviandoDBIndi(indicadores);
            enviandoDBPIB(metricasDoPibs);


        } catch (IOException e) {
            log.logMensagem(LocalDateTime.now(), "ERRO", "Erro a ler Planilha");
        }
    }


    //Metodo para mandar dados para o banco de dados
    public void enviandoDBMuni (List<Municipio> municipios ) {
        //Instanciando os classes usadas
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        Log log = new Log();

        log.logMensagem(LocalDateTime.now(), "Debug", "Mandando para o banco de dados os municipios");

        //percorrendo municipios
        for (Municipio municipio : municipios) {

            //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
            template.update("Insert Into Municipios values (Default, ? , ? )", municipio.getNomeMunicipio(), municipio.getRegioesIdRegioes());

        }
        log.logMensagem(LocalDateTime.now(), "Debug", "Terminou o envio dos municipios");
     }


    //Metodo para mandar dados para o banco de dados
    public void enviandoDBIndi (List<Indicadores> indicadores ) {

        //Instanciando os classes usadas
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        Log log = new Log();

        log.logMensagem(LocalDateTime.now(), "Debug", "Mandando para o banco de dados os Indicadores");
        for (Indicadores indicador : indicadores) {

            //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo do Indicador
            template.update("Insert Into Indicadores values (Default, ? , ? , ? ,?)", indicador.getAno(),indicador.getValor_adicionado(),indicador.getSetoresIdSetores(), indicador.getMunicipiosIdMunicipios());

        }
        log.logMensagem(LocalDateTime.now(), "Debug", "Terminou o envio dos Indicadores");
    }


    //Metodo para mandar dados para o banco de dados
    public void enviandoDBPIB (List<MetricasDoPib> metricas) {

        //Instanciando os classes usadas
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        Log log = new Log();

        log.logMensagem(LocalDateTime.now(), "Debug", "Mandando para o banco de dados os Indicadores");
        for (MetricasDoPib metrica : metricas) {

            //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
            template.update("Insert Into Metricas_do_Pib values (Default, ? , ? , ? ,?,?)", metrica.getImpostos(),metrica.getPib(),metrica.getPib_per_capita(), metrica.getAno(), metrica.getMunicipIsIdMunicipios());

        }
        log.logMensagem(LocalDateTime.now(), "Debug", "Terminou o envio das metricas do PIB");
    }

    //Metodo para mandar dados para o banco de dados
    public void enviandoDBSetores () {

        //Instanciando os classes usadas
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());
        Log log = new Log();
        List<Setores> setores = new ArrayList<>();

        Setores setor1 = new Setores(1, "Agropecuária");
        setores.add(setor1);
        Setores setor2 = new Setores(2, "Indúastria");
        setores.add(setor2);
        Setores setor3  = new Setores(3, "AdministracaoPública");
        setores.add(setor3);
        Setores setor4 = new Setores(4, "TotalInclusiveADMP");
        setores.add(setor4);
        Setores setor5= new Setores(5, "Total");
        setores.add(setor5);

        log.logMensagem(LocalDateTime.now(), "Debug", "Mandando para o banco de dados os Setores ");
        for (Setores setor : setores) {

            //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
            template.update("Insert Into Setores values ( ? , ? )", setor.getIdSetores(),setor.getNomeSetor());

        }
        log.logMensagem(LocalDateTime.now(), "Debug", "Terminou o envio das metricas do PIB");
    }

    // fim do leitor
}

