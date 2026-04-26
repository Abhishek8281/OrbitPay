#![no_std]

use soroban_sdk::{contract, contractimpl, contractevent, token, Address, Env};

const TOKEN_KEY: &[u8] = b"token_contract";

#[contract]
pub struct PaymentHelper;

#[contractevent]
pub struct PaymentEvent {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

#[contractimpl]
impl PaymentHelper {
    pub fn init(env: Env, token_address: Address) {
        env.storage().instance().set(&TOKEN_KEY, &token_address);
    }

    pub fn send_token_from(env: Env, from: Address, to: Address, amount: i128) -> bool {
        from.require_auth();
        
        let token_address = Self::get_token_address(&env);
        let client = token::TokenClient::new(&env, &token_address);
        client.transfer(&from, &to, &amount);
        
        PaymentEvent { from, to, amount }.publish(&env);
        true
    }

    pub fn get_token_balance(env: Env, account: Address) -> i128 {
        let token_address = Self::get_token_address(&env);
        let client = token::TokenClient::new(&env, &token_address);
        client.balance(&account)
    }

    fn get_token_address(env: &Env) -> Address {
        env.storage().instance().get(&TOKEN_KEY).expect("Token not set")
    }
}