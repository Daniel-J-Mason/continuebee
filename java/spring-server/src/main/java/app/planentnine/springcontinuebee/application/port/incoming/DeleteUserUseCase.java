package app.planentnine.springcontinuebee.application.port.incoming;

import app.planentnine.springcontinuebee.application.domain.Message;

public interface DeleteUserUseCase {
    boolean deleteUser(Message message);
}
