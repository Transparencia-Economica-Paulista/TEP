package school.sptech;

import java.util.Random;

public class main {
    public static void main(String[] args) throws InterruptedException {
        Log metodos = new Log();
        Random aleatorio = new Random();


        String[] mensagensLogs = {
                "[INFO] Iniciando processamento de dados.",
                "[INFO] Conexão estabelecida com sucesso.",
                "[INFO] Usuário autenticado com sucesso.",
                "[DEBUG] Consultando dados do usuário.",
                "[DEBUG] Cache limpo com sucesso.",
                "[WARNING] Tempo de resposta acima do esperado.",
                "[WARNING] Tentativa de acesso sem autenticação.",
                "[WARNING] Sessão expirada. Solicitando login novamente.",
                "[ERROR] Erro ao salvar registro no banco!",
                "[ERROR] Tentando reconectar ao servidor...",
                "[ERROR] Permissão negada para gravar no diretório.",
                "[TRACE] Lendo linhas 1..100.",
                "[TRACE] Lendo linhas 101..200."
        };

        while (true) {

            String DataHora = metodos.data();
            String logs = mensagensLogs[aleatorio.nextInt(mensagensLogs.length)];

            System.out.println(DataHora + " " + logs);

            Thread.sleep(2000);
        }
    }
}
