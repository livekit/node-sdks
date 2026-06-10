// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { describe, expect, it } from 'vitest';
import { validateAgentDeploymentString } from './AgentDispatchClient.js';

describe('validateAgentDeploymentString', () => {
  it('accepts a valid deployment string with allowed separators', () => {
    expect(() => validateAgentDeploymentString('my-agent_v1.0')).not.toThrow();
  });

  it('accepts a single alphanumeric character', () => {
    expect(() => validateAgentDeploymentString('a')).not.toThrow();
  });

  it('throws when the string exceeds 63 characters', () => {
    expect(() => validateAgentDeploymentString('a'.repeat(64))).toThrow(
      'Deployment string must not exceed 63 characters',
    );
  });

  it('throws when it does not start with an alphanumeric character', () => {
    expect(() => validateAgentDeploymentString('-agent')).toThrow(
      'Deployment must start and end with an alphanumeric character',
    );
  });

  it('throws when it does not end with an alphanumeric character', () => {
    expect(() => validateAgentDeploymentString('agent.')).toThrow(
      'Deployment must start and end with an alphanumeric character',
    );
  });

  it.each(['my agent', 'a/b', 'a@b', 'a:b', 'a+b', 'a,b'])(
    'throws on unallowed character in the middle: %j',
    (deployment) => {
      expect(() => validateAgentDeploymentString(deployment)).toThrow(
        'Deployment must start and end with an alphanumeric character',
      );
    },
  );

  it('accepts an empty string (targets the production deployment)', () => {
    // An empty deployment is explicitly allowed: per the docstring, leaving it
    // empty targets the production deployment. The validator early-returns
    // before the alphanumeric regex would otherwise reject it.
    expect(() => validateAgentDeploymentString('')).not.toThrow();
  });

  it.each([
    ['null byte', 'agent\0'],
    ['tab', 'a\tb'],
    ['newline in the middle', 'a\nb'],
    ['carriage return', 'a\rb'],
    ['vertical tab', 'a\x0bb'],
  ])('throws on control character (%s)', (_label, deployment) => {
    expect(() => validateAgentDeploymentString(deployment)).toThrow(
      'Deployment must start and end with an alphanumeric character',
    );
  });

  it('rejects a trailing newline (JS $ must not match before it)', () => {
    // Without the `m` flag, JS anchors `$` at the true end of string, so a
    // smuggled trailing newline ("agent\n") is correctly rejected rather than
    // treated as a valid "agent".
    expect(() => validateAgentDeploymentString('agent\n')).toThrow(
      'Deployment must start and end with an alphanumeric character',
    );
  });

  it.each([
    ['path traversal', '../etc'],
    ['leading slash', '/agent'],
    ['leading whitespace', ' agent'],
    ['trailing whitespace', 'agent '],
    ['unicode homoglyph', 'agént'],
  ])('rejects security-relevant input (%s)', (_label, deployment) => {
    expect(() => validateAgentDeploymentString(deployment)).toThrow(
      'Deployment must start and end with an alphanumeric character',
    );
  });
});
