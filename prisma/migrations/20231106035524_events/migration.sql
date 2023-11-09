-- CreateTable
CREATE TABLE "event" (
    "id_event" SERIAL NOT NULL,
    "community_id" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id_event")
);

-- CreateTable
CREATE TABLE "event_attendee" (
    "event_id_attendee" INTEGER NOT NULL,
    "user_id_attendee" INTEGER NOT NULL,

    CONSTRAINT "event_attendee_pkey" PRIMARY KEY ("event_id_attendee","user_id_attendee")
);

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community"("id_community") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_event_id_attendee_fkey" FOREIGN KEY ("event_id_attendee") REFERENCES "event"("id_event") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_user_id_attendee_fkey" FOREIGN KEY ("user_id_attendee") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
