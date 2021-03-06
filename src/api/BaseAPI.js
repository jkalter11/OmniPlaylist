/**
 * Created by cqian19 on 5/23/2017.
 */
import axios from 'axios';

import { RENDER_TYPES, DOMAIN_TYPES, API_URL } from '../core/constants';
import { DOMAIN_PROPS } from '../core/domain-map-constants';

/* An abstract class for APIs */
class BaseAPI {

    static RENDER_TYPES = RENDER_TYPES;
    static DOMAIN_TYPE  = "";

    static _getDomainProps(domainType) {
        return DOMAIN_PROPS[domainType];
    }

    static _isLink(link, links) {
        if (!links || !links.length) {
            return false;
        } else {
            return links.some((urlMatch) => urlMatch.test(link));
        }
    }

    static _isVideoLink(link){
        const domainType = this.DOMAIN_TYPE;
        const videoLinks = this._getDomainProps(domainType).videoLinks;
        return this._isLink(link, videoLinks);
    }

    static _isPlaylistLink(link){
        const domainType = this.DOMAIN_TYPE;
        const playlistLinks = this._getDomainProps(domainType).playlistLinks;
        return this._isLink(link, playlistLinks);
    }

    static _isStreamLink(link) {
        const domainType = this.DOMAIN_TYPE;
        const streamLinks = this._getDomainProps(domainType).streamLinks;
        return this._isLink(link, streamLinks);
    }

    static getRenderType(link, domainType){
        return this._isVideoLink(link)    ? RENDER_TYPES.VIDEO
            :  this._isPlaylistLink(link) ? RENDER_TYPES.PLAYLIST
            :  this._isStreamLink(link)   ? RENDER_TYPES.STREAM
                                          : RENDER_TYPES.INVALID;
    };

    static getBackendAPIURL(renderType) {
        let resource = '';
        switch(renderType) {
            case RENDER_TYPES.VIDEO:
                resource = 'video';
                break;
            case RENDER_TYPES.PLAYLIST:
                resource = 'playlist';
                break;
            case RENDER_TYPES.STREAM:
                resource = 'stream';
                break;
        }
        return `${API_URL}/${this.DOMAIN_TYPE}/${resource}`;
    }



    static getVideoFromResponse(response){};
    static getPlaylistFromResponse(response){};
    static getPlaylistIndexFromLink(link) {
        return 0;
    };
    static getStreamFromResponse(response){};
    static fetchPlaylist(link){};
    static fetchVideo(link){};
    static fetchStream(link){};
    static fetchKey() {
        return axios.get(`${API_URL}/${this.DOMAIN_TYPE}/key`);
    }

}

export default BaseAPI;