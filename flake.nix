{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, utils, nixpkgs }:
    utils.lib.eachDefaultSystem (system:
      let pkgs = (import nixpkgs) {
        inherit system;
      };

      in {
        devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            nodePackages.pnpm
            cargo
            rustc
            xorg.libXext
            xorg.libX11
            libGL
            clang
          ];
          LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
        };
      }
    );
}
