import { UserResult } from './api-result.model';

interface LoginInfo extends Object {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  timezone: {
    offset: string;
    description: string;
  };
}

export class User {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  cell?: string;
  image?: string;
  imageSrc?: string;
  age?: number;
  dateOfBirth?: string;
  nat?: string;
  gender?: string;
  address?: Address;
  registeredDate?: string;
  login?: LoginInfo;

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

  /**
   * Maps the api result to an array of User objects
   * @param {UserResult[]} userResults
   * @returns {User[]}
   */
  static mapFromUserResult(userResults: UserResult[]): User[] {
    return userResults.map(
      (user) =>
        new User({
          firstname: user.name.first,
          lastname: user.name.last,
          email: user.email,
          phone: user.phone,
          cell: user.cell,
          image: user.picture.medium,
          imageSrc: `${user.picture.medium}?id=${user.login.uuid}`,
          age: user.dob.age,
          dateOfBirth: new Date(user.dob.date).toLocaleDateString(),
          nat: user.nat,
          gender: user.gender,
          address: {
            street: `${user.location.street.number} ${user.location.street.name}`,
            city: user.location.city,
            state: user.location.state,
            country: user.location.country,
            postcode: String(user.location.postcode),
            coordinates: {
              latitude: user.location.coordinates.latitude,
              longitude: user.location.coordinates.longitude,
            },
            timezone: {
              offset: user.location.timezone.offset,
              description: user.location.timezone.description,
            },
          },
          registeredDate: new Date(user.registered.date).toLocaleDateString(),
          login: user.login,
        })
    );
  }
}
