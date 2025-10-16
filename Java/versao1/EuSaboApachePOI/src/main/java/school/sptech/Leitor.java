package school.sptech;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Leitor {

    // No leitor só tem metodo extrairMunicipios

    // Que retorna uma Lista de Municipio e recebe como parâmetro "nomeDoArquivo"
    public List<Municipio> extrairMunicipios(String nomeDoArquivo){

        // chama a instância log
        Log log = new Log();

        // Cria uma lista de municipios
        List<Municipio> municipios = new ArrayList<>();

        // Chama o logMensagem
        log.logMensagem( LocalDateTime.now(), "Debug" , "Iniciando Leitura de Arquivo");

        // Abre um Bloco "Try" que se conecta a um "Catch"
        // Que trata exceções caso o Arquivo não consiga ser leito
        try(
                // Isso explica que vai receber um arquivo que terá o "nomeDoArquivo"
                InputStream arquivo = new FileInputStream(nomeDoArquivo);

                // E instância Workbook que que representa um arquivo excel
                // XSSFWorkbook é usado quando o formato da planilha é xlsx. Caso seja xls, é usado HSSFWorkbook
                Workbook workbook = new XSSFWorkbook(arquivo);
                ){

            // Essa parte vai usar a planilha que foi passada e explica a folha que vai ser usada. Que neste caso é a "0"
            Sheet sheet = workbook.getSheetAt(0);

            // Chama o logMensagem
            log.logMensagem( LocalDateTime.now(), "Debug" , "Acessando planilha");

            // Percorre a pagina passada e percorre ela como se fosse cada linha
            for (Row row : sheet) {

                // aqui confere se a linha especifica "8" é a da vez. E eu suponha que tenha os titulos aqui
                // Neste caso não tem
                if (row.getRowNum() == 8 ){

                    // Chama o logMensagem
                    log.logMensagem( LocalDateTime.now(), "Debug" , "Encontrou Cabeçalho");
                    printarCabecalho(row);
                    continue;
                }
                // aqui confere se a linha da vez está entre as informadas nessa condicional. Neste caso passei só onde tem dados do municipios na planilha
                if (row.getRowNum() > 10 && row.getRowNum() <= 655){

                    // Chama o logMensagem
                    log.logMensagem( LocalDateTime.now(), "Debug" , ("Lendo celulas da linha " + row.getRowNum()));

                    if (row.getCell(1).getStringCellValue().equals("RMC") || row.getCell(1).getStringCellValue().equals("RMSP") ) {

                        // Neste bloco declaro variáveis que terá o nomes igual as da propriedade da Classe munícipio só para ficar mais fácil identificar.
                        //  O "row" é a linha da vez. O "getCell(e numero especifico)" estou falando que na Célula com o numero especifico que é igual a da coluna que quero (Se a tabela tem 8 coluna, para pegar a primeira usa "0" e para a coluna 8 usa "7")
                        //  O "getStringCellValue()" ou  "getNumericCellValue()" declara que aquele valor da célula vai ser e um tipo específico
                        String nome = row.getCell(0).getStringCellValue();
                        String sigla = row.getCell(1).getStringCellValue();
                        String regiao = row.getCell(2).getStringCellValue();
                        Double agro = row.getCell(3).getNumericCellValue();
                        Double industria = row.getCell(4).getNumericCellValue();
                        Double admPublica = row.getCell(5).getNumericCellValue();
                        Double totalAdmPublica = row.getCell(6).getNumericCellValue();
                        Double totalGeral = row.getCell(7).getNumericCellValue();
                        Double impostos = row.getCell(8).getNumericCellValue();
                        Double pib = row.getCell(9).getNumericCellValue();
                        Double pibPerCapita = row.getCell(10).getNumericCellValue();


                        // Instancio um Municipio com as variáveis declaras no bloco anterior
                        Municipio municipio = new Municipio(nome, sigla, regiao, agro, industria, admPublica, totalAdmPublica, totalGeral, impostos, pib, pibPerCapita);
                        // e Adiciono esse municipio Na lista "municipios" que foi criada nesse metodo
                        municipios.add(municipio);
                    }
                }

            }
            // Chama o logMensagem
            log.logMensagem( LocalDateTime.now(), "Debug" , "Leitura completa");

            // Retorna a lista criada e que foi adicionada os municipios
            return municipios;
        }catch (IOException e){
            //Essa é a exceção que caso dê erro a leitura do arquivo e entra catch

            // Chama o logMensagem
            log.logMensagem( LocalDateTime.now(), "ERRO" , "Erro a ler Planilha");

            // Retorna uma lista vazia
            return municipios;
        }

    }

    // Aqui em baixo tem alguns métodos que tinha no exemplo do professor. Mas não estão sendo usados, porque não tem uma linha certa para o nome de cada dado da planilha
    private void printarCabecalho(Row row){

        for (int i  =  0; i < 10; i++){

            String coluna = row.getCell(i).getStringCellValue();
        }
        printarLinhas();
    }
    private void printarLinhas(){
        System.out.println("-".repeat(100));
    }

}
