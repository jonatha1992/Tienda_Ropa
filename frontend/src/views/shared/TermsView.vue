<template>
  <div class="min-h-screen bg-white py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-light tracking-wide text-gray-900 mb-4">Términos y Condiciones</h1>
        <p class="text-lg text-gray-600">Última actualización: {{ lastUpdated }}</p>
      </div>

      <div class="prose prose-lg max-w-none">
        <div class="space-y-8">
          <!-- 1. Aceptación de tÃ©rminos -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">1. Aceptación de los TÃ©rminos</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Al acceder y utilizar el sitio web de M-VINTAGE (el "Sitio"), usted acepta estar sujeto a estos 
              Términos y Condiciones de uso. Si no estÃ¡ de acuerdo con alguna parte de estos tÃ©rminos, 
              no debe utilizar nuestro sitio web.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Estos tÃ©rminos se aplican a todos los visitantes, usuarios y otras personas que accedan 
              o utilicen el servicio.
            </p>
          </section>

          <!-- 2. DescripciÃ³n del servicio -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">2. DescripciÃ³n del Servicio</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              M-VINTAGE es una tienda online de ropa vintage y contemporÃ¡nea. Ofrecemos una plataforma 
              para la compra de productos de moda, accesorios y artÃ­culos relacionados.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del 
              servicio en cualquier momento sin previo aviso.
            </p>
          </section>

          <!-- 3. Registro y cuenta -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">3. Registro y Cuenta de Usuario</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Para realizar compras, es necesario crear una cuenta proporcionando informaciÃ³n precisa y completa. 
              Usted es responsable de mantener la confidencialidad de su cuenta y contraseÃ±a.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Debe ser mayor de 18 aÃ±os para crear una cuenta</li>
              <li>La informaciÃ³n proporcionada debe ser veraz y actualizada</li>
              <li>Es responsable de todas las actividades que ocurran bajo su cuenta</li>
              <li>Debe notificarnos inmediatamente sobre cualquier uso no autorizado</li>
            </ul>
          </section>

          <!-- 4. Productos y precios -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">4. Productos y Precios</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nos esforzamos por mostrar con precisiÃ³n los colores y detalles de nuestros productos. 
              Sin embargo, no podemos garantizar que la visualizaciÃ³n en su dispositivo sea exacta.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Los precios estÃ¡n sujetos a cambios sin previo aviso</li>
              <li>Los precios incluyen impuestos aplicables</li>
              <li>Nos reservamos el derecho de limitar cantidades</li>
              <li>Los productos estÃ¡n sujetos a disponibilidad</li>
            </ul>
          </section>

          <!-- 5. Proceso de compra -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">5. Proceso de Compra y Pago</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Al realizar un pedido, estÃ¡ haciendo una oferta para comprar el producto. Todas las Ã³rdenes 
              estÃ¡n sujetas a aceptaciÃ³n y confirmaciÃ³n del precio del producto.
            </p>
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 class="font-medium text-gray-900 mb-2">MÃ©todos de Pago Aceptados:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Tarjetas de crÃ©dito y dÃ©bito (Visa, Mastercard, American Express)</li>
                <li>Mercado Pago</li>
                <li>Transferencia bancaria</li>
                <li>Pago en efectivo (Rapipago, Pago FÃ¡cil)</li>
              </ul>
            </div>
          </section>

          <!-- 6. EnvÃ­os y entrega -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">6. EnvÃ­os y Entrega</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Los tiempos de entrega son estimados y pueden variar segÃºn la ubicaciÃ³n y disponibilidad del producto. 
              Los costos de envÃ­o se calcularÃ¡n durante el proceso de checkout.
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Realizamos envÃ­os a todo el territorio argentino</li>
              <li>El riesgo de pÃ©rdida pasa al comprador al momento de la entrega</li>
              <li>Es responsabilidad del comprador proporcionar una direcciÃ³n correcta</li>
            </ul>
          </section>

          <!-- 7. Devoluciones y cambios -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">7. Devoluciones y Cambios</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Aceptamos devoluciones dentro de los 30 dÃ­as posteriores a la recepciÃ³n del producto, 
              siempre que el artÃ­culo estÃ© en condiciones originales.
            </p>
            <div class="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 class="font-medium text-gray-900 mb-2">Condiciones para Devoluciones:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>El producto debe estar sin usar y con etiquetas originales</li>
                <li>Debe incluir el comprobante de compra</li>
                <li>Los gastos de envÃ­o de devoluciÃ³n corren por cuenta del cliente</li>
                <li>El reembolso se procesarÃ¡ dentro de 5-10 dÃ­as hÃ¡biles</li>
              </ul>
            </div>
          </section>

          <!-- 8. Propiedad intelectual -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">8. Propiedad Intelectual</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Todo el contenido del sitio web, incluyendo textos, grÃ¡ficos, logos, Ã­conos, imÃ¡genes, 
              clips de audio y software, es propiedad de M-VINTAGE y estÃ¡ protegido por las leyes 
              de derechos de autor.
            </p>
            <p class="text-gray-700 leading-relaxed">
              No estÃ¡ permitido reproducir, distribuir, modificar o crear trabajos derivados del 
              contenido sin autorizaciÃ³n expresa por escrito.
            </p>
          </section>

          <!-- 9. LimitaciÃ³n de responsabilidad -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">9. LimitaciÃ³n de Responsabilidad</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              En ningÃºn caso M-VINTAGE serÃ¡ responsable por daÃ±os indirectos, incidentales, especiales 
              o consecuentes que resulten del uso o la imposibilidad de usar el sitio web o los productos.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Nuestra responsabilidad total no excederÃ¡ el monto pagado por el producto especÃ­fico 
              que dio origen al reclamo.
            </p>
          </section>

          <!-- 10. Privacidad -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">10. Privacidad y ProtecciÃ³n de Datos</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Respetamos su privacidad y estamos comprometidos con la protecciÃ³n de sus datos personales. 
              Para mÃ¡s informaciÃ³n, consulte nuestra 
              <router-link to="/privacy" class="text-blue-600 hover:text-blue-800 underline">
                PolÃ­tica de Privacidad
              </router-link>.
            </p>
          </section>

          <!-- 11. Modificaciones -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">11. Modificaciones de los TÃ©rminos</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Nos reservamos el derecho de modificar estos tÃ©rminos en cualquier momento. 
              Las modificaciones entrarÃ¡n en vigor inmediatamente despuÃ©s de su publicaciÃ³n en el sitio web.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Es su responsabilidad revisar periÃ³dicamente estos tÃ©rminos para estar al tanto de las actualizaciones.
            </p>
          </section>

          <!-- 12. Ley aplicable -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">12. Ley Aplicable y JurisdicciÃ³n</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Estos tÃ©rminos se rigen por las leyes de la RepÃºblica Argentina. Cualquier disputa 
              serÃ¡ resuelta en los tribunales competentes de la Ciudad AutÃ³noma de Buenos Aires.
            </p>
          </section>

          <!-- 13. Contacto -->
          <section>
            <h2 class="text-2xl font-light text-gray-900 mb-4">13. InformaciÃ³n de Contacto</h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-gray-700 mb-4">
                Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos:
              </p>
              <div class="space-y-2 text-gray-700">
                <p><strong>Email:</strong> 
                  <a href="mailto:mvintageapp@gmail.com" class="text-blue-600 hover:text-blue-800">
                    mvintageapp@gmail.com
                  </a>
                </p>
                <p><strong>TelÃ©fono:</strong> 
                  <a href="tel:+5491139471826" class="text-blue-600 hover:text-blue-800">
                    +54 9 11 3947-1826
                  </a>
                </p>
                <p><strong>DirecciÃ³n:</strong> Buenos Aires, Argentina</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
