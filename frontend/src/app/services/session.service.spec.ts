import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';
import {User} from "../models/User";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";

describe('SessionService', () => {
  let service: SessionService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected user (HttpClient called once)', (done: DoneFn) => {
    const expectedUser: User = {
      username: "testUser",
      email: "testUser",
      password: "testUser",
      nom: "testUser",
      cognom: "testUser",
      birthdate: "testUser",
      is_admin: false
    };

    httpClientSpy.get.and.returnValue(of(expectedUser));

    service.register(expectedUser).subscribe({
      next: user => {
        expect(user)
          .withContext('expected user')
          .toEqual(expectedUser);
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.get.calls.count())
      .withContext('one call')
      .toBe(1);
  });


});
