package org.example.onlinetest.service;

import com.nimbusds.jose.JOSEException;
import org.example.onlinetest.dto.admin.request.*;
import org.example.onlinetest.dto.admin.response.AuthenticationResponse;
import org.example.onlinetest.dto.admin.response.IntrospectResponse;
import org.example.onlinetest.dto.admin.response.UserResponse;

import java.text.ParseException;
import java.util.List;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    Boolean createUser(UserRequest request);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
    void logout(LogoutRequest request) throws JOSEException, ParseException;
    AuthenticationResponse refreshToken(RefreshRequest request)throws ParseException, JOSEException;
    List<UserResponse> getUsers();
    UserResponse myProfile(String id);
}
