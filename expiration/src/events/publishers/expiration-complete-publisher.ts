import {Subjects, Publisher,ExpirationCompeteEvent} from '@ds99ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompeteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}