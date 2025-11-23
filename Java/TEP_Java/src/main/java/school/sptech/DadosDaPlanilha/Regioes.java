package school.sptech.DadosDaPlanilha;

public class Regioes {
    private Integer idRegiao;
    private String nomeRegiao;
    private String siglaRegiao;

    public Regioes() {
    }

    public Regioes(String nomeRegiao, String siglaRegiao) {
        this.nomeRegiao = nomeRegiao;
        this.siglaRegiao = siglaRegiao;
    }

    public Integer getIdRegiao() {
        return idRegiao;
    }

    public String getNomeRegiao() {
        return nomeRegiao;
    }

    public String getSiglaRegiao() {
        return siglaRegiao;
    }

    @Override
    public String toString() {
        return "Regiao{" +
                "idRegiao=" + idRegiao +
                ", nomeRegiao='" + nomeRegiao + '\'' +
                ", siglaRegiao='" + siglaRegiao + '\'' +
                '}';
    }
}
