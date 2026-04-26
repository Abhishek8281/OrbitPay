#![no_std]

use soroban_sdk::{contract, contractimpl, contractevent, Address, Env};

const ADMIN_KEY: &[u8] = b"admin";

#[contract]
pub struct Token;

#[contractevent]
pub struct TransferEvent {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

#[contractimpl]
impl Token {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN_KEY, &admin);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin = env.storage().instance().get::<_, Address>(&ADMIN_KEY).unwrap_or_else(|| panic!("Not initialized"));
        admin.require_auth();
        
        let key = to.as_val();
        let balance = env.storage().persistent().get::<_, i128>(&key).unwrap_or(0);
        let new_balance = balance.saturating_add(amount);
        env.storage().persistent().set(&key, &new_balance);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        
        let from_key = from.as_val();
        let to_key = to.as_val();
        
        let from_balance = env.storage().persistent().get::<_, i128>(&from_key).unwrap_or(0);
        if from_balance < amount {
            panic!("Insufficient balance");
        }
        
        let from_new = from_balance.saturating_sub(amount);
        let to_balance = env.storage().persistent().get::<_, i128>(&to_key).unwrap_or(0);
        let to_new = to_balance.saturating_add(amount);
        
        env.storage().persistent().set(&from_key, &from_new);
        env.storage().persistent().set(&to_key, &to_new);
        
        TransferEvent { from, to, amount }.publish(&env);
    }

    pub fn balance_of(env: Env, account: Address) -> i128 {
        let key = account.as_val();
        env.storage().persistent().get::<_, i128>(&key).unwrap_or(0)
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage().instance().get(&ADMIN_KEY).expect("Not initialized")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_token() {
        let env = Env::default();
        
        let contract_id = env.register(Token, ());
        let client = TokenClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let recipient = Address::generate(&env);
        
        env.mock_all_auths();
        
        client.init(&admin);
        client.mint(&user, &1000);
        assert_eq!(client.balance_of(&user), 1000);
        
        client.transfer(&user, &recipient, &500);
        assert_eq!(client.balance_of(&user), 500);
        assert_eq!(client.balance_of(&recipient), 500);
    }
}