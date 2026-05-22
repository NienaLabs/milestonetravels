import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ tourId: string }>;
}) {
  const { tourId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/auth/sign-in?callbackURL=/checkout/${tourId}`);
  }

  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
  });

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Tour not found
      </div>
    );
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId: session.user.id,
      tourId: tour.id,
    }
  });

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <Navbar />

      <div className="relative pt-28 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute top-24 right-[-6rem] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <CheckoutForm
            tour={{
              id: tour.id,
              title: tour.title,
              price: tour.price,
              image: tour.image,
              departureDate: tour.departureDate.toISOString(),
              returnDate: tour.returnDate.toISOString(),
              destination: tour.destination,
            }}
            user={{
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
            }}
            booking={existingBooking ? {
              id: existingBooking.id,
              amountPaid: existingBooking.amountPaid,
            } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
