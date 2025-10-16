package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.List;

public class Municipio {
    // Aqui passamos os atributos do objeto que tem que ser igual ao banco de dados para fazer um SELECT. neste caso, não está pois falta id. Mas no código não temos SELECT
    private Integer idMunicipios;
    private String nomeMunicipio;
    private Integer RegioesIdRegioes;

    // Construtor
    public Municipio(Integer idMunicipios, String nomeMunicipio, Integer regioesIdRegioes) {
        this.idMunicipios = idMunicipios;
        this.nomeMunicipio = nomeMunicipio;
        RegioesIdRegioes = regioesIdRegioes;
    }

    // colocamos todos os gets e sets, e no fim desse metodo temos um ToString para retornar no sout uma lista configurada

    public Integer getIdMunicipios() {
        return idMunicipios;
    }

    public void setIdMunicipios(Integer idMunicipios) {
        this.idMunicipios = idMunicipios;
    }

    public String getNomeMunicipio() {
        return nomeMunicipio;
    }

    public void setNomeMunicipio(String nomeMunicipio) {
        this.nomeMunicipio = nomeMunicipio;
    }

    public Integer getRegioesIdRegioes() {
        return RegioesIdRegioes;
    }

    public void setRegioesIdRegioes(Integer regioesIdRegioes) {
        RegioesIdRegioes = regioesIdRegioes;
    }


    @Override
    public String toString() {
        return "Municipio{" +
                "idMunicipios=" + idMunicipios +
                ", nomeMunicipio=" + nomeMunicipio +
                ", RegioesIdRegioes=" + RegioesIdRegioes +
                '}';
    }
}
