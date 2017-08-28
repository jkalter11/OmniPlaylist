/**
 * Created by cqian19 on 5/26/2017.
 */
'use strict';
const electron = require('electron');
const { initialize, isAd, client } = require('is-ad');

initialize();
/*
    Allows embedding of unembeddable Youtube videos, ad blocking
 */
function create(win, referer) {
    win.webContents.session.webRequest.onBeforeRequest(['*://*./*'], (details, callback) => {
        const url = details.url;
        const handledYt = _handleYtBeforeRequest(url, callback);
        if (handledYt) { return; }
        _handleAdBlockBeforeRequest(url, callback);
    });
    const headerFilter = {
        urls: ['https://www.youtube.com/*']
    };
    win.webContents.session.webRequest.onBeforeSendHeaders(headerFilter, (detail, cb) => {
        let {requestHeaders} = detail;
        requestHeaders = Object.assign(requestHeaders, {
            Referer: requestHeaders.Referer || referer,
            Origin: requestHeaders.Origin || referer});
        cb({requestHeaders});
    }, {
        urls: ['<all_urls>'],
        types: ['xmlhttprequest']
    });
}

function _handleYtBeforeRequest(url, callback) {
    const pattern = /https:\/\/www\.youtube\.com\/get_video_info\?.*eurl&.*/;
    if (pattern.test(url)) {
        callback({
            redirectURL: url.replace("eurl", "eurl=http://youtube.com")
        });
        return true;
    }
    return false;
}

/**
 * From electron-ad-blocker:
 *  @link https://github.com/Jense5/electron-ad-blocker/blob/master/src/index.js
 */
function _handleAdBlockBeforeRequest(url, callback) {
    callback({ cancel: isAd(url) });
}

module.exports = (referer, win) => {
    if (typeof referer !== 'string') {
        throw new TypeError('Expected a string');
    }

    if (win) {
        create(win, referer);
        return;
    }

    (electron.BrowserWindow || electron.remote.BrowserWindow).getAllWindows().forEach(win => {
        create(win, referer);
    });
    (electron.app || electron.remote.app).on('browser-window-created', (e, win) => {
        create(win, referer);
    });
};