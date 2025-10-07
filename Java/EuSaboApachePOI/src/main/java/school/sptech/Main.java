package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // Precisar passar as dependências no arquivo pom.xml. No caso desde arquivo passei as dependências do mysql, jdbc e do Apache POI

        // Fazemos uma instância para a conexão.
        Conexao conexao = new Conexao();
        JdbcTemplate template = new JdbcTemplate(conexao.getConexao());

        // Fazemos uma instância para o log.
        Log log = new Log();

        // Fazemos uma variável que vai ter o nome do arquivo que vai ser lido
        String nomeDoArquivo = "pib-municipios-2021_site.xlsx";

        // Fazemos uma instância para o Leitor (Classe responsável por ler a planilha usando Apache POI).
        Leitor leitor1 = new Leitor();

        // Declaramos uma variável que será uma Lista de municipios (Classe criada que represetará os municípios capturados na planilha)
        // Ela vai receber o resultado do metodo "extrairMunicios", que tem no leitor. E passará como parâmetro a variável declarada que passará o nome do arquivo.
        List<Municipio> municipios = leitor1.extrairMunicipios(nomeDoArquivo);

        // Chama o metodo "logMensagem" e passa um LocalDateTime que tem o metodo "now" que passa a hora e data atual , tipo do log e a mensagem
        log.logMensagem( LocalDateTime.now(), "Debug" , "Iniciando Lançamento de dados para o banco");

        // Nesse bloco confere se a tabela já existe no banco e exclui ela. E então cria a uma tabela municipio
        template.execute("drop table if exists municipios");
        template.execute("Create Table municipios(id int primary key auto_increment, nome Varchar(45),sigla Varchar(45) ,regiao Varchar(45), agro DECIMAL(15,4),industria DECIMAL(15,3),admPublica DECIMAL(15,3) ,totalAdmPublica DECIMAL(15,3),totalGeral DECIMAL(15,3) ,impostos DECIMAL(15,3),pib DECIMAL(15,3) ,pibPerCapita DECIMAL(15,3) )");

        // Percorre a Lista "municipios"
        for (Municipio municipio : municipios) {

            // Chama o metodo "logMensagem"
            log.logMensagem( LocalDateTime.now(), "Debug" , ("Lançando informaçoes sobre " + municipio.getNome()));

            // Faz o INSERT no banco de dados chamando o metodo GET de cada atributo de Municipio
            template.update("Insert Into municipios values (Default, ? , ? , ?, ?, ?, ? ,? , ?, ?, ?, ?)", municipio.getNome(), municipio.getSigla(),
                    municipio.getRegiao(), municipio.getAgro(), municipio.getIndustria(), municipio.getAdmPublica(), municipio.getTotalAdmPublica(),
                    municipio.getTotalGeral(), municipio.getImpostos(), municipio.getPib() , municipio.getPibPerCapita());

        }
        // Chama o metodo "logMensagem"
        log.logMensagem( LocalDateTime.now(), "Debug" , "Lançamento completo");
    }
}
