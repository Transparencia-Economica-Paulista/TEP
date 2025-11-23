package school.sptech.DadosDaPlanilha;

public class Municipio {
    // Aqui passamos os atributos do objeto que tem que ser igual ao banco de dados para fazer um SELECT. neste caso, não está pois falta id. Mas no código não temos SELECT
    private Integer idMunicipios;
    private String nomeMunicipio;
    private Regioes regiao;

    // Construtor

    public Municipio(String nomeMunicipio, Regioes regiao) {
        this.nomeMunicipio = nomeMunicipio;
        this.regiao = regiao;
    }

    // colocamos todos os gets, e no fim desse metodo temos um ToString para retornar no sout uma lista configurada

    public Integer getIdMunicipios() {
        return idMunicipios;
    }

    public String getNomeMunicipio() {
        return nomeMunicipio;
    }

    public Regioes getRegiao() {
        return regiao;
    }


    @Override
    public String toString() {
        return "Municipio{" +
                "idMunicipios=" + idMunicipios +
                ", nomeMunicipio='" + nomeMunicipio + '\'' +
                ", regiao=" + regiao +
                '}';
    }
}
