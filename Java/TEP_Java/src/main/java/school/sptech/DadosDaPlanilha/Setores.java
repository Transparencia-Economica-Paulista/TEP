package school.sptech.DadosDaPlanilha;

public class Setores {
    private Integer idSetores;
    private String nomeSetor;

    public Setores() {
    }

    public Setores(Integer idSetores, String nomeSetor) {
        this.idSetores = idSetores;
        this.nomeSetor = nomeSetor;
    }

    public Integer getIdSetores() {
        return idSetores;
    }

    public void setIdSetores(Integer idSetores) {
        this.idSetores = idSetores;
    }

    public String getNomeSetor() {
        return nomeSetor;
    }

    public void setNomeSetor(String nomeSetor) {
        this.nomeSetor = nomeSetor;
    }

    @Override
    public String toString() {
        return "Setores{" +
                "idSetores=" + idSetores +
                ", nomeSetor='" + nomeSetor + '\'' +
                '}';
    }
}
