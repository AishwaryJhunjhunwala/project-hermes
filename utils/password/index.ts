import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new Error('Password is required for hashing');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch {
    throw new Error(`Error hashing password`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Both password and hashed password are required for comparison');
    }

    if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
      throw new Error('Password and hash must be strings');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch {
    throw new Error(`Error comparing password`);
  }
};
