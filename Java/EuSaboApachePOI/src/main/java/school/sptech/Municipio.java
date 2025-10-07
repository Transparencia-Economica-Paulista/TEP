package school.sptech;

import java.text.DecimalFormat;

public class Municipio {
    // Aqui passamos os atributos do objeto que tem que ser igual ao banco de dados para fazer um SELECT. neste caso, não está pois falta id. Mas no código não temos SELECT
    private String nome;
    private String sigla;
    private String regiao;
    private Double agro;
    private Double industria;
    private Double admPublica;
    private Double totalAdmPublica;
    private Double totalGeral;
    private Double impostos;
    private Double pib;
    private Double pibPerCapita;

    // Construtor
    public Municipio(String nome, String sigla, String regiao, Double agro, Double industria, Double admPublica, Double totalAdmPublica, Double totalGeral, Double impostos, Double pib, Double pibPerCapita) {

        this.nome = nome;
        this.sigla = sigla;
        this.regiao = regiao;
        this.agro = agro;
        this.industria = industria;
        this.admPublica = admPublica;
        this.totalAdmPublica = totalAdmPublica;
        this.totalGeral = totalGeral;
        this.impostos = impostos;
        this.pib = pib;
        this.pibPerCapita = pibPerCapita;
    }
    // colocamos todos os gets e sets, e no fim desse metodo temos um ToString para retornar no sout uma lista configurada
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }

    public String getRegiao() {
        return regiao;
    }

    public void setRegiao(String regiao) {
        this.regiao = regiao;
    }

    public Double getAgro() {
        return agro;
    }

    public void setAgro(Double agro) {
        this.agro = agro;
    }

    public Double getIndustria() {
        return industria;
    }

    public void setIndustria(Double industria) {
        this.industria = industria;
    }

    public Double getAdmPublica() {
        return admPublica;
    }

    public void setAdmPublica(Double admPublica) {
        this.admPublica = admPublica;
    }

    public Double getTotalAdmPublica() {
        return totalAdmPublica;
    }

    public void setTotalAdmPublica(Double totalAdmPublica) {
        this.totalAdmPublica = totalAdmPublica;
    }

    public Double getTotalGeral() {
        return totalGeral;
    }

    public void setTotalGeral(Double totalGeral) {
        this.totalGeral = totalGeral;
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

    public Double getPibPerCapita() {
        return pibPerCapita;
    }

    public void setPibPerCapita(Double pibPerCapita) {
        this.pibPerCapita = pibPerCapita;
    }

    public void setPib(Double pib) {
        this.pib = pib;
    }

    @Override
    // Aqui está um dos problemas que achei na hora de pegar os dados. Porque os valores muito grande estavam vindo em notação científica
    // Entãp temos o metodo que vai tratar isso que é o "DecimalFormat" que vai passar um formato para os valores decimais que são: agro, industria, admPublica, totalAdmPublica, totalGeral, impostos, pib.
    // De resto o ToString vai passar dos os dados sem diferença
    public String toString() {

        DecimalFormat df = new DecimalFormat("#,##0.00");

        return String.format(

                "Municipio{nome='%s', sigla='%s', regiao='%s', agro=%s, industria=%s, admPublica=%s, totalAdmPublica=%s, totalGeral=%s, impostos=%s, pib=%s, pibPerCapita=%s}",

                nome, sigla, regiao,

                df.format(agro),

                df.format(industria),

                df.format(admPublica),

                df.format(totalAdmPublica),

                df.format(totalGeral),

                df.format(impostos),

                df.format(pib),

                df.format(pibPerCapita)

        );

    }
}
