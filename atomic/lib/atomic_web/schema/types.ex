defmodule AtomicWeb.Schema.Types do
  use Absinthe.Schema.Notation

  object :project do
    field :id, :id
    field :name, :string
    field :abbreviation, :string
  end
end
