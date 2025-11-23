package school.sptech.DadosDaPlanilha.Indicadores;

import school.sptech.DadosDaPlanilha.Municipio;

import java.text.DecimalFormat;

public class MetricasDoPib extends Indicador{
    private Double impostos;
    private Double pib;
    private Double pibPerCapita;

    public MetricasDoPib(Integer ano, Municipio municipio, Double impostos, Double pib, Double pibPerCapita) {
        super(ano, municipio);
        this.impostos = impostos;
        this.pib = pib;
        this.pibPerCapita = pibPerCapita;
    }

    public Double getImpostos() {
        return impostos;
    }

    public Double getPib() {
        return pib;
    }

    public Double getPibPerCapita() {
        return pibPerCapita;
    }

    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("#,##0.00");

        return "MetricasDoPib {" +
                "\n  ano           = " + getAno() +
                "\n  municipio     = " + getMunicipio() +
                "\n  impostos      = " + df.format(impostos) +
                "\n  pib           = " + df.format(pib) +
                "\n  pibPerCapita  = " + df.format(pibPerCapita) +
                "\n}";
    }

}
