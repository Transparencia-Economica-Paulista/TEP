package school.sptech;

import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

public class S3Conexao {
    private final AwsCredentialsProvider credentials;

    // Pega as variaveis de ambiente para configurar as credenciais
    public S3Conexao() {
        this.credentials = DefaultCredentialsProvider.create();
    }

    public S3Client getS3Client(){
        return S3Client.builder().region(Region.US_EAST_1).credentialsProvider(credentials).build();
    }
}
