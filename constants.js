
class C {
}
C.HOST_KEY = "host";
C.PORT_KEY = "port";
C.UPDATE_TOPIC_KEY = "updatetopic";
C.HISTORY_REQUEST_TOPIC_KEY = "historyrequesttopic";
C.CONTROL_TOPIC_KEY = "controltopic"
C.METADATA_TOPIC_KEY = "metadatatopic";

C.DEFAULT_HOST = "localhost";
C.DEFAULT_PORT = "1883";

C.DEFAULT_UPDATE_TOPIC = "home/garage/door/update";
C.DEFAULT_HISTORY_REQUEST_TOPIC = "home/server/garage/historyrequest";
C.DEFAULT_CONTROL_TOPIC = "home/garage/door/control";
C.DEFAULT_METADATA_TOPIC = "home/garage/door/metadata";

C.DATETIME_FORMAT = "mmmm dS, yyyy h:MM TT";

module.exports = C;
