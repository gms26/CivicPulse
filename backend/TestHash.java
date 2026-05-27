import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Admin@123";
        String hash = "$2a$10$vit.MtLP6rJIW0GezC4b9Oq2QFzvPbNdipKjVPcNOfSt7MBijNWDm";
        System.out.println("Matches? " + encoder.matches(rawPassword, hash));
        System.out.println("New hash: " + encoder.encode(rawPassword));
    }
}
