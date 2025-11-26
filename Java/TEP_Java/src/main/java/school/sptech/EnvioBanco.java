package school.sptech;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import school.sptech.DadosDaPlanilha.Indicadores.Indicador;
import school.sptech.DadosDaPlanilha.Indicadores.IndicadorPorSetor;
import school.sptech.DadosDaPlanilha.Indicadores.MetricasDoPib;
import school.sptech.DadosDaPlanilha.Municipio;
import school.sptech.DadosDaPlanilha.Setores;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import static school.sptech.Logs.Log.logMensagem;

public class  EnvioBanco {
    static ZoneId zoneId = ZoneId.of("America/Sao_Paulo");


    // Inicio dos metodos de Inserir no Banco De Dados

    //Metodo para mandar dados para o banco de dados
    public static void enviandoDBMuni (List<Municipio> municipios, JdbcTemplate template ) {
        //Instanciando as classes usadas

        logMensagem(LocalDateTime.now(zoneId), "Debug", "Mandando para o banco de dados os Municípios");

        //percorrendo municipios
        for (Municipio municipio : municipios) {
            Integer id = 0;

            Integer idMunicipio = null;
            try {

                idMunicipio = template.queryForObject(
                        "select idMunicipios from Municipios where nome_municipio = ?",
                        Integer.class,
                        municipio.getNomeMunicipio()
                );

            }catch (EmptyResultDataAccessException e){
                idMunicipio = null;
            }

            if(idMunicipio == null) {

                if (municipio.getRegiao().getSiglaRegiao().equals("RMC") ) {
                    id = template.queryForObject(
                            "select idRegioes from Regioes where sigla_regiao = ?",
                            Integer.class,
                            "RMC"
                    );
                } else {
                    id = template.queryForObject(
                            "select idRegioes from Regioes where nome_regiao = ? and sigla_regiao = ?",
                            Integer.class,
                            municipio.getRegiao().getNomeRegiao(), municipio.getRegiao().getSiglaRegiao()
                    );
                }
                //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
                template.update("Insert Into Municipios values (Default, ? , ? )", municipio.getNomeMunicipio(), id);
            }
        }
        logMensagem(LocalDateTime.now(zoneId), "Debug", "Terminou o envio dos Municípios");
    }




    public static void separandoIndicadores(List<Indicador> indicadores, JdbcTemplate template){
        List<IndicadorPorSetor> indicadorPorSetors = new ArrayList<>();
        List<MetricasDoPib> metricasDoPibs = new ArrayList<>();


        for (Indicador indi : indicadores) {

            indi.setIdMunicipio( template.queryForObject(
                    "select idMunicipios from Municipios where nome_municipio = ?",
                    Integer.class,
                    indi.getMunicipio().getNomeMunicipio()
            ));
            if (indi
                    instanceof MetricasDoPib pib) {
                metricasDoPibs.add(pib);

            }
            if (indi
                    instanceof IndicadorPorSetor setor) {

                indicadorPorSetors.add(setor);

            }
        }
        enviandoDBMetricasPib(metricasDoPibs,template);
        enviandoDBIndiSetor(indicadorPorSetors,template);

    }
    public static void enviandoDBMetricasPib(List<MetricasDoPib> metricasDoPibs,JdbcTemplate template){


        String sql = """
        INSERT INTO Metricas_do_pib (impostos, pib, pib_per_capita, ano, Municipios_idMunicipios)
        VALUES (?, ?, ?, ?, ?)
    """;

        template.batchUpdate(sql, metricasDoPibs, metricasDoPibs.size(), (ps, ind) -> {
            ps.setDouble(1, ind.getImpostos());
            ps.setDouble(2, ind.getPib());
            ps.setDouble(3, ind.getPibPerCapita());
            ps.setInt(4, ind.getAno());
            ps.setInt(5, ind.getIdMunicipio());
        });

        logMensagem(LocalDateTime.now(zoneId), "Debug", "enviou as Métricas do PIB");
    }
    public static void enviandoDBIndiSetor(List<IndicadorPorSetor> indicadorPorSetors, JdbcTemplate template){


        String sql = """
        INSERT INTO Indicadores (ano, valor_adicionado, Setores_idSetores,Municipios_idMunicipios)
        VALUES (?, ?, ?, ?)
    """;

        template.batchUpdate(sql, indicadorPorSetors, indicadorPorSetors.size(), (ps, setor) -> {
            ps.setInt(1, setor.getAno());
            ps.setDouble(2, setor.getValor_adicionado());
            ps.setInt(3, setor.getSetor().getIdSetores());
            ps.setDouble(4, setor.getIdMunicipio());
        });

        logMensagem(LocalDateTime.now(zoneId), "Debug", "enviou os Indicadores por Setor");

    }




    //Metodo para mandar dados para o banco de dados
    public static void enviandoDBSetores (List<Setores> setores , JdbcTemplate template) {


        logMensagem(LocalDateTime.now(zoneId), "Debug", "Mandando para o banco de dados os Setores ");
        for (Setores setor : setores) {

            //Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
            template.update("Insert Into Setores values ( ? , ? )", setor.getIdSetores(),setor.getNomeSetor());

        }
        logMensagem(LocalDateTime.now(zoneId), "Debug", "Terminou o envio dos Setores");
    }

}
