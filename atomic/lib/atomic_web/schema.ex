defmodule AtomicWeb.Schema do
  use Absinthe.Schema

  query do
    field :hello, :string do
      resolve(&AtomicWeb.Schema.Resolvers.hello/3)
    end
  end
end
