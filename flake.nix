# SPDX-FileCopyrightText: 2024 LiveKit, Inc.
#
# SPDX-License-Identifier: Apache-2.0

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
            nodejs
            corepack
            cargo
            rustc
            xorg.libXext
            xorg.libX11
            libGL
            clang
            reuse
            git-lfs
          ];
          LIBCLANG_PATH = "${pkgs.libclang.lib}/lib";
        };
      }
    );
}
