package school.sptech;

public class Regioes {
    private Integer idRegiao;
    private String nomeRegiao;
    private String siglaRegiao;

    public Regioes() {
    }

    public Regioes(Integer idRegiao, String nomeRegiao, String siglaRegiao) {
        this.idRegiao = idRegiao;
        this.nomeRegiao = nomeRegiao;
        this.siglaRegiao = siglaRegiao;
    }

    public Integer getIdRegiao() {
        return idRegiao;
    }

    public void setIdRegiao(Integer idRegiao) {
        this.idRegiao = idRegiao;
    }

    public String getNomeRegiao() {
        return nomeRegiao;
    }

    public void setNomeRegiao(String nomeRegiao) {
        this.nomeRegiao = nomeRegiao;
    }

    public String getSiglaRegiao() {
        return siglaRegiao;
    }

    public void setSiglaRegiao(String siglaRegiao) {
        this.siglaRegiao = siglaRegiao;
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
