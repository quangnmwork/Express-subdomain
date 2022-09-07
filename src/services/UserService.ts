const data = [
  {
    name: "Company One",
    subdomain: "my-comp",
    users: [
      {
        email: "user1@comp.com",
        password: "123456",
      },
      {
        email: "user2@comp.com",
        password: "123456",
      },
    ],
  },
  {
    name: "Company Two",
    subdomain: "my-other-comp",
    users: [
      {
        email: "user1@ocomp.com",
        password: "123456",
      },
    ],
  },
];

export interface User {
  email: string;
  password: string;
  subdomain?: string;
}
interface Company {
  name: string;
  subdomain: string;
  users: User[];
}

export class UserService {
  // TODO: add more utilities

  private getAllUsers(): User[] {
    // Refactor this using Map-Reduce
    let users: User[] = [];
    for (const company of data) {
      users.push(...company.users);
    }
    return users;
  }

  private getSubdomain(email: string) {
    return data.filter((c) => c.users.some((u) => u.email === email))[0]
      .subdomain;
  }

  public getUser(email: string, password: string): User | null {
    const users = this.getAllUsers().filter(
      (u) => u.email === email && u.password === password
    );
    if (!users) throw new Error("Failed to get user");
    if (users.length === 0) return null;
    return {
      email,
      password: '',
      subdomain: this.getSubdomain(email),
    };
  }

  public login(email: string, password: string): boolean {
    return this.getAllUsers().some(
      (u) => u.email === email && u.password === password
    );
  }
}
