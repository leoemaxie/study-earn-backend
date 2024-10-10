#!/usr/bin/env bash
# bash script to generate private and public keys for JWT
openssl genrsa -out access_token_private.pem 2048
openssl rsa -in access_token_private.pem -pubout -out access_token_public.pem

openssl genrsa -out refresh_token_private.pem 2048
openssl rsa -in refresh_token_private.pem -pubout -out refresh_token_public.pem