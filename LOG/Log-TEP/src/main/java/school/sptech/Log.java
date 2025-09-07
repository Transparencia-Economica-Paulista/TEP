package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {
    String data(){
        LocalDateTime agora = LocalDateTime.now();

        DateTimeFormatter formatterDataHora = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        return formatterDataHora.format(agora);
    }
}

