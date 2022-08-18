defmodule AtomicWeb.Schema.Resolvers do
  def hello(root, args, resolution) do
    IO.inspect(resolution)
    IO.inspect(root)
    IO.inspect(args)

    {:ok, "world"}
  end
end
