// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

use livekit_ffi::{proto, server, FFI_SERVER};
use neon::{prelude::*, types::{*, buffer::TypedArray}};
use prost::Message;
use std::sync::Arc;

fn livekit_initialize(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let cb = cx.argument::<JsFunction>(0)?.root(&mut cx);
    let capture_logs = cx.argument::<JsBoolean>(1)?.value(&mut cx);
    let channel = cx.channel();

    std::thread::spawn(move || {
        FFI_SERVER.setup(server::FfiConfig {
            callback_fn: Arc::new(move |event| {
                // TODO(nbsp): blehhhh fix this
                // let event = event.encode_to_vec().as_slice().as_ref().clone();
                // let event = JsUint8Array::from_slice(&mut cx, event).unwrap();
                channel.send(move |mut cx| {
                    // let cb = cb.into_inner(&mut cx);
                    // cb.call_with(&mut cx).arg(event);
                    Ok(())
                });
            }),
            capture_logs
        })
    });

    Ok(cx.undefined())
}

fn livekit_ffi_request(mut cx: FunctionContext) -> JsResult<JsUint8Array> {
    let data = cx.argument::<JsUint8Array>(0)?.root(&mut cx).into_inner(&mut cx);
    let res = proto::FfiRequest::decode(data.as_slice(&mut cx)).unwrap();
    let res = server::requests::handle_request(&FFI_SERVER, res).unwrap().encode_to_vec();
    Ok(JsUint8Array::from_slice(&mut cx, &res)?)
}

fn livekit_retrieve_ptr(mut cx: FunctionContext) -> JsResult<JsBigInt> {
    let handle = cx.argument::<JsUint8Array>(0)?.root(&mut cx).into_inner(&mut cx);
    let ptr = handle.as_slice(&mut cx).as_ptr() as u64;
    Ok(JsBigInt::from_u64(&mut cx, ptr))
}

fn livekit_copy_buffer(mut cx: FunctionContext) -> JsResult<JsUint8Array> {
    let ptr = cx.argument::<JsBigInt>(0)?.to_u64(&mut cx).unwrap();
    let len = cx.argument::<JsNumber>(1)?.value(&mut cx);
    let data = unsafe { std::slice::from_raw_parts(ptr as *const u8, len as usize) };
    Ok(JsUint8Array::from_slice(&mut cx, data).unwrap())
}

pub struct FfiHandle {
    handle: u64,
    disposed: bool,
    // TODO(theomonnom): add gc pressure memory
}

impl FfiHandle {
    pub fn new(mut cx: FunctionContext) -> JsResult<JsBox<Self>> {
        let handle = cx.argument::<JsBigInt>(0)?.to_u64(&mut cx).unwrap();
        Ok(cx.boxed(Self {
            handle,
            disposed: false,
        }))
    }

    pub fn dispose(&mut self) {
        if !self.disposed {
            self.disposed = true;
            FFI_SERVER.drop_handle(self.handle);
        }
    }

    pub fn handle(self, mut cx: FunctionContext) -> JsResult<JsBigInt> {
        let handle = self.handle.clone();
        Ok(JsBigInt::from_u64(&mut cx, handle))
    }
}

impl Finalize for FfiHandle {
    fn finalize<'a, C: Context<'a>>(mut self, cx: &mut C) {
        self.dispose();
    }
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("livekitInitialize", livekit_initialize)?;
    cx.export_function("livekitFfiRequest", livekit_ffi_request)?;
    cx.export_function("livekitRetrievePtr", livekit_retrieve_ptr)?;
    cx.export_function("livekitCopyBuffer", livekit_copy_buffer)?;
    Ok(())
}
