import { UserResult } from './api-result.model'

interface LoginInfo extends Object {
  uuid: string
  username: string
  password: string
  salt: string
  md5: string
  sha1: string
  sha256: string
}

export class User {
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  image?: string
  imageSrc?: string
  age?: number
  nat?: string
  login?: LoginInfo

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data)
  }

  /**
   * Maps the api result to an array of User objects
   * @param {UserResult[]} userResults
   * @returns {User[]}
   */
  static mapFromUserResult(userResults: UserResult[]): User[] {
    return userResults.map(user => new User({
      firstname: user.name.first,
      lastname: user.name.last,
      email: user.email,
      phone: user.phone,
      image: user.picture.medium,
      imageSrc: `${user.picture.medium}?id=${user.login.uuid}`,
      age: user.dob.age,
      nat: user.nat,
      login: user.login
    }))
  }
}
