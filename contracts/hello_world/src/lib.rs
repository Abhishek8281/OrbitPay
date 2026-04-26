#![no_std]

use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec};

#[contract]
pub struct HelloWorld;

#[contractimpl]
impl HelloWorld {
    pub fn hello(env: Env, name: String) -> Vec<String> {
        let mut greeting = String::from_slice(&env, "Hello, ");
        greeting.append(&name);
        vec![&env, greeting]
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_hello() {
        let env = Env::default();
        let name = String::from_slice(&env, "World");
        let result = HelloWorld::hello(env, name);
        assert_eq!(result.len(), 1);
    }
}