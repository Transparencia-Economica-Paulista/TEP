package school.sptech.Logs;

public class LogMensagem {
    private String horaAtual;
    private String tipoLog;
    private  String mensagem;

    public LogMensagem(String horaAtual, String tipoLog, String mensagem) {
        this.horaAtual = horaAtual;
        this.tipoLog = tipoLog;
        this.mensagem = mensagem;
    }

    public String getHoraAtual() {
        return horaAtual;
    }

    public String getTipoLog() {
        return tipoLog;
    }

    public String getMensagem() {
        return mensagem;
    }
}
