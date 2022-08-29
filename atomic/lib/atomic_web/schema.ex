defmodule AtomicWeb.Schema do
  use Absinthe.Schema

  query do
    field :hello, :string do
      middleware(AtomicWeb.Schema.AuthenticationMiddleware)

      resolve(&AtomicWeb.Schema.Resolvers.hello/3)
    end
  end
end
