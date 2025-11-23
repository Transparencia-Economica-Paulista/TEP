package school.sptech.DadosDaPlanilha.Indicadores;

import school.sptech.DadosDaPlanilha.Municipio;
import school.sptech.DadosDaPlanilha.Setores;

import java.text.DecimalFormat;

public class IndicadorPorSetor  extends Indicador{
    private Double valor_adicionado;
    private Setores setor;

    public IndicadorPorSetor(Integer ano, Municipio municipio, Double valor_adicionado, Setores setor) {
        super(ano, municipio);
        this.valor_adicionado = valor_adicionado;
        this.setor = setor;
    }

    public Double getValor_adicionado() {
        return valor_adicionado;
    }

    public Setores getSetor() {
        return setor;
    }

    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("#,##0.00");

        return "IndicadorPorSetor {" +
                "\n  ano               = " + getAno() +
                "\n  municipio         = " + getMunicipio() +
                "\n  valor_adicionado  = " + df.format(valor_adicionado) +
                "\n  setor             = " + setor +
                "\n}";
    }

}
