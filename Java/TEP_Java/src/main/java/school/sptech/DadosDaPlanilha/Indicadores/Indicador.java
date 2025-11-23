package school.sptech.DadosDaPlanilha.Indicadores;

import school.sptech.DadosDaPlanilha.Municipio;

public abstract class Indicador {
    private Integer ano;
    private Municipio municipio;
    private Integer idMunicipio;

    public Indicador(Integer ano, Municipio municipio) {
        this.ano = ano;
        this.municipio = municipio;
    }

    public Integer getAno() {
        return ano;
    }


    public Municipio getMunicipio() {
        return municipio;
    }

    public Integer getIdMunicipio() {
        return idMunicipio;
    }

    public void setIdMunicipio(Integer idMunicipio) {
        this.idMunicipio = idMunicipio;
    }
}
