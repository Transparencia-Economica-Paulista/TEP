package school.sptech;

import java.text.DecimalFormat;

public class MetricasDoPib {
    private Integer idMetricasDoPib;
    private Double impostos;
    private Double pib;
    private Double pibPerCapita;
    private Integer ano;
    private String  MunicipiosNome;

    public MetricasDoPib( Double impostos, Double pib, Double pibPerCapita, Integer ano, String municipiosNome) {

        this.impostos = impostos;
        this.pib = pib;
        this.pibPerCapita = pibPerCapita;
        this.ano = ano;
        MunicipiosNome = municipiosNome;
    }

    public Integer getIdMetricas_do_pib() {
        return idMetricasDoPib;
    }

    public void setIdMetricas_do_pib(Integer idMetricasDoPib) {
        this.idMetricasDoPib = idMetricasDoPib;
    }

    public Double getImpostos() {
        return impostos;
    }

    public void setImpostos(Double impostos) {
        this.impostos = impostos;
    }

    public Double getPib() {
        return pib;
    }

    public void setPib(Double pib) {
        this.pib = pib;
    }

    public Double getPib_per_capita() {
        return pibPerCapita;
    }

    public void setPib_per_capita(Double pibPerCapita) {
        this.pibPerCapita = pibPerCapita;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getMunicipIsNome() {
        return MunicipiosNome;
    }

    public void setMunicipIsNome(String municipiosNome) {
        MunicipiosNome = municipiosNome;
    }


    // Aqui está um dos problemas que achei na hora de pegar os dados. Porque os valores muito grande estavam vindo em notação científica
    // Entãp temos o metodo que vai tratar isso que é o "DecimalFormat" que vai passar um formato para os valores decimais que são: agro, industria, admPublica, totalAdmPublica, totalGeral, impostos, pib.
    // De resto o ToString vai passar dos os dados sem diferença
    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("#,##0.00");

        return String.format(
                "MetricasDoPib{idMetricasDoPib=%s, impostos=%s, pib=%s, pibPerCapita=%s, ano=%s, MunicipiosNome=%s}",
                idMetricasDoPib,
                df.format(impostos),
                df.format(pib),
                df.format(pibPerCapita),
                ano,
                MunicipiosNome
        );
    }
}
