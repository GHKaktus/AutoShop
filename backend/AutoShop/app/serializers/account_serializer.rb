class AccountSerializer
  def self.as_json(account)
    {
      email: account.email,
      role:  account.role
    }
  end

  def self.collection_as_json(accounts)
    accounts.map { |account| as_json(account) }
  end
end
