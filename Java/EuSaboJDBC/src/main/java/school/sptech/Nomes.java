package school.sptech;

public class Nomes {
    // Aqui passamos os atributos do objeto que tem que ser igual ao banco de dados

    private Integer id;
    private String nome;

    // colocamos todos os gets e sets, e no fim desse metodo temos um ToString para retornar no sout uma lista configurada
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Nomes{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                '}';
    }
}
