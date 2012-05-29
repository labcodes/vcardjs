
// exported globals
var VCard;

(function() {

    VCard = function() {
    };

    VCard.prototype = {

        // don't set attributes directly. always use this method.
        // it may call callbacks in the future.
        setAttribute: function(key, value) {
            this[key] = value;
        },

        addAttribute: function(key, value) {
            console.log('add attribute', key, value);
            if(VCard.multivaluedKeys[key]) {
                if(this[key]) {
                    this[key].push(value);
                } else {
                    this.setAttribute(key, [value]);
                }
            } else {
                this.setAttribute(key, value);
            }
        },

        toJCard: function() {
            var jcard = {};
            for(var k in VCard.allKeys) {
                var key = VCard.allKeys[k];
                if(this[key]) {
                    jcard[key] = this[key];
                }
            }
            return jcard;
        },

        // synchronizes two vcards, using the mechanisms described in
        // RFC 6350, Section 7.
        // Returns a new VCard object.
        // If a property is present in both source vcards, and that property's
        // maximum cardinality is 1, then the value from the second (given) vcard
        // precedes.
        //
        // TODO: implement PID matching as described in 7.3.1
        merge: function(other) {
            if(typeof(other.uid) !== 'undefined' &&
               typeof(this.uid) !== 'undefined' &&
               other.uid !== this.uid) {
                // 7.1.1
                throw "Won't merge vcards without matching UIDs.";
            }

            var result = new VCard();

            function mergeProperty(key) {
                if(other[key]) {
                    if(other[key] == this[key]) {
                        result.setAttribute(this[key]);
                    } else {
                        result.addAttribute(this[key]);
                        result.addAttribute(other[key]);
                    }
                } else {
                    result[key] = this[key];
                }
            }

            for(key in this) { // all properties of this
                mergeProperty(key);
            }
            for(key in other) { // all properties of other *not* in this
                if(! result[key]) {
                    mergeProperty(key);
                }
            }
        }
    };

    VCard.enums = {
        telType: ["text", "voice", "fax", "cell", "video", "pager", "textphone"],
        relatedType: ["contact", "acquaintance", "friend", "met", "co-worker",
                      "colleague", "co-resident", "neighbor", "child", "parent",
                      "sibling", "spouse", "kin", "muse", "crush", "date",
                      "sweetheart", "me", "agent", "emergency"],
        // FIXME: these aren't actually defined anywhere. just very commmon.
        //        maybe there should be more?
        emailType: ["work", "home"],
        langType: ["work", "home"],
        
    };

    VCard.allKeys = [
        'fn', 'n', 'nickname', 'photo', 'bday', 'anniversary', 'gender',
        'tel', 'email', 'impp', 'lang', 'tz', 'geo', 'title', 'role', 'logo',
        'org', 'member', 'related', 'categories', 'note', 'prodid', 'rev',
        'sound', 'uid'
    ];

    VCard.multivaluedKeys = {
        email: true,
        tel: true,
        geo: true,
        title: true,
        role: true,
        logo: true,
        org: true,
        member: true,
        related: true,
        categories: true,
        note: true
    };

})();
