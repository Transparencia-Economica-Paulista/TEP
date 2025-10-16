package school.sptech;

import java.text.DecimalFormat;

public class Indicadores {
    private Integer idIndicadores;
    private Integer ano;
    private Double valor_adicionado;
    private Integer SetoresIdSetores;
    private Integer MunicipiosIdMunicipios;

    public Indicadores(Integer ano, Double valor_adicionado, Integer setoresIdSetores, Integer municipiosIdMunicipios) {

        this.ano = ano;
        this.valor_adicionado = valor_adicionado;
        SetoresIdSetores = setoresIdSetores;
        MunicipiosIdMunicipios = municipiosIdMunicipios;
    }

    public Integer getIdIndicadores() {
        return idIndicadores;
    }

    public void setIdIndicadores(Integer idIndicadores) {
        this.idIndicadores = idIndicadores;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public Double getValor_adicionado() {
        return valor_adicionado;
    }

    public void setValor_adicionado(Double valor_adicionado) {
        this.valor_adicionado = valor_adicionado;
    }

    public Integer getSetoresIdSetores() {
        return SetoresIdSetores;
    }

    public void setSetoresIdSetores(Integer setoresIdSetores) {
        SetoresIdSetores = setoresIdSetores;
    }

    public Integer getMunicipiosIdMunicipios() {
        return MunicipiosIdMunicipios;
    }

    public void setMunicipiosIdMunicipios(Integer municipiosIdMunicipios) {
        MunicipiosIdMunicipios = municipiosIdMunicipios;
    }


    // Aqui está um dos problemas que achei na hora de pegar os dados. Porque os valores muito grande estavam vindo em notação científica
    // Entãp temos o metodo que vai tratar isso que é o "DecimalFormat" que vai passar um formato para os valores decimais que são: agro, industria, admPublica, totalAdmPublica, totalGeral, impostos, pib.
    // De resto o ToString vai passar dos os dados sem diferença
    @Override
    public String toString() {
        DecimalFormat df = new DecimalFormat("#,##0.00");

        return String.format(
                "Indicadores{idIndicadores=%s, ano=%s, valor_adicionado=%s, SetoresIdSetores=%s, MunicipiosIdMunicipios=%s}",
                idIndicadores,
                ano,
                df.format(valor_adicionado),
                SetoresIdSetores,
                MunicipiosIdMunicipios
        );
    }
}
