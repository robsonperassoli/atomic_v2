defmodule AtomicWeb.Schema.Types do
  use Absinthe.Schema.Notation

  object :project do
    field :id, :id
    field :name, :string
    field :abbreviation, :string
  end

  object :task do
    field :id, :id
    field :content, :string
    field :time_sec, :integer
  end
end
