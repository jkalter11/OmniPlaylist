/**
 * Created by cqian19 on 7/28/2017.
 */

const playlistSchema = {
    'title': 'Playlist schema',
    'description': 'Describes a playlist object',
    'version': 0,
    'type': 'object',

    'properties': {
        'uniqueId': {
            'type': 'string',
            'primary': true
        },
        'name': {'type': 'string'},
        'playlistIndex': {'type': 'number'},
        'videos': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'domain':    {'type': 'string'},
                    'title':     {'type': 'string'},
                    'linkId':    {'type': 'string'},
                    'thumbnail': {'type': 'string'},
                },
            }
        }
    },
};

export default playlistSchema;