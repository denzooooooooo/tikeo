export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ORGANIZER"] = "ORGANIZER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["SCANNER"] = "SCANNER";
})(UserRole || (UserRole = {}));
export var EventCategory;
(function (EventCategory) {
    EventCategory["MUSIC"] = "MUSIC";
    EventCategory["SPORTS"] = "SPORTS";
    EventCategory["ARTS"] = "ARTS";
    EventCategory["TECHNOLOGY"] = "TECHNOLOGY";
    EventCategory["BUSINESS"] = "BUSINESS";
    EventCategory["FOOD"] = "FOOD";
    EventCategory["HEALTH"] = "HEALTH";
    EventCategory["EDUCATION"] = "EDUCATION";
    EventCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
    EventCategory["OTHER"] = "OTHER";
})(EventCategory || (EventCategory = {}));
export var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "DRAFT";
    EventStatus["PUBLISHED"] = "PUBLISHED";
    EventStatus["CANCELLED"] = "CANCELLED";
    EventStatus["POSTPONED"] = "POSTPONED";
    EventStatus["COMPLETED"] = "COMPLETED";
})(EventStatus || (EventStatus = {}));
export var EventVisibility;
(function (EventVisibility) {
    EventVisibility["PUBLIC"] = "PUBLIC";
    EventVisibility["PRIVATE"] = "PRIVATE";
    EventVisibility["UNLISTED"] = "UNLISTED";
})(EventVisibility || (EventVisibility = {}));
export var TicketStatus;
(function (TicketStatus) {
    TicketStatus["VALID"] = "VALID";
    TicketStatus["USED"] = "USED";
    TicketStatus["CANCELLED"] = "CANCELLED";
    TicketStatus["REFUNDED"] = "REFUNDED";
    TicketStatus["TRANSFERRED"] = "TRANSFERRED";
    TicketStatus["EXPIRED"] = "EXPIRED";
})(TicketStatus || (TicketStatus = {}));
export var TransferStatus;
(function (TransferStatus) {
    TransferStatus["PENDING"] = "PENDING";
    TransferStatus["ACCEPTED"] = "ACCEPTED";
    TransferStatus["REJECTED"] = "REJECTED";
    TransferStatus["CANCELLED"] = "CANCELLED";
})(TransferStatus || (TransferStatus = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (OrderStatus = {}));
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["APPLE_PAY"] = "APPLE_PAY";
    PaymentMethod["GOOGLE_PAY"] = "GOOGLE_PAY";
    PaymentMethod["PAYPAL"] = "PAYPAL";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethod || (PaymentMethod = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["EVENT_REMINDER"] = "EVENT_REMINDER";
    NotificationType["TICKET_PURCHASED"] = "TICKET_PURCHASED";
    NotificationType["TICKET_TRANSFERRED"] = "TICKET_TRANSFERRED";
    NotificationType["EVENT_UPDATED"] = "EVENT_UPDATED";
    NotificationType["EVENT_CANCELLED"] = "EVENT_CANCELLED";
    NotificationType["REFUND_PROCESSED"] = "REFUND_PROCESSED";
    NotificationType["RECOMMENDATION"] = "RECOMMENDATION";
    NotificationType["MARKETING"] = "MARKETING";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (NotificationType = {}));
//# sourceMappingURL=index.js.map