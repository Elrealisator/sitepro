import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react'; // Ajout de AlertCircle pour les erreurs

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    timeline: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nouveau : pour l'état de chargement
  const [submissionError, setSubmissionError] = useState<string | null>(null); // Nouveau : pour la gestion des erreurs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSubmissionError(null); // Efface les erreurs lors de la modification d'un champ
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Active l'état de chargement
    setSubmissionError(null); // Efface les erreurs précédentes

    // Validation côté client (basique)
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmissionError("Veuillez remplir tous les champs obligatoires marqués d'un *.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Netlify Forms utilise un format spécifique pour les requêtes AJAX.
      // Nous allons utiliser le format URL-encoded pour la simplicité avec le traitement de Netlify Forms.
      const encode = (data: Record<string, string>) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      // Envoi des données à Netlify Forms
      const response = await fetch("/", { // L'URL "/" est interceptée par Netlify pour ses formulaires
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Nécessaire pour Netlify Forms
        body: encode({
          "form-name": "contact", // IMPORTANT : Ceci doit correspondre à l'attribut 'name' d'un formulaire HTML conceptuel pour Netlify
          ...formData,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', budget: '', timeline: '' }); // Réinitialise le formulaire
        setTimeout(() => setIsSubmitted(false), 5000); // Cache le message de succès après 5 secondes
      } else {
        const errorText = await response.text();
        console.error("Erreur de soumission du formulaire Netlify :", response.status, errorText);
        setSubmissionError("Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.");
      }
    } catch (error) {
      console.error("Erreur réseau ou de soumission :", error);
      setSubmissionError("Problème de connexion. Veuillez vérifier votre réseau.");
    } finally {
      setIsSubmitting(false); // Désactive l'état de chargement
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'divantchuisseu@gmail.com',
      description: 'Réponse sous 24h',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+237 6 56 48 15 31',
      description: 'Lun-Ven 9h-18h',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      value: 'Cameroun, Télétravail',
      description: 'Projets à distance',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const faqs = [
    {
      question: 'Quels sont vos délais de réalisation ?',
      answer: 'Les délais varient selon le projet : 2-5 jours pour un CV, 1-2 semaines pour du design graphique, 2-6 semaines pour un site web.'
    },
    {
      question: 'Proposez-vous des révisions ?',
      answer: 'Oui, chaque projet inclut 2-3 révisions gratuites selon le service. Des modifications supplémentaires peuvent être facturées.'
    },
    {
      question: 'Travaillez-vous avec des clients internationaux ?',
      answer: 'Absolument ! Je travaille avec des clients du monde entier, principalement en français et en anglais.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de la section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contactez-moi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vous avez un projet en tête ? Discutons-en ! Je suis là pour vous accompagner
            et transformer vos idées en réalité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Démarrons votre projet
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-600">
                    Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" name="contact" data-netlify="true" netlify-honeypot="bot-field">
                  {/* Champ caché pour Netlify Honeypot (anti-spam) */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p hidden>
                    <label>
                      Ne remplissez pas ce champ : <input name="bot-field" onChange={handleChange} />
                    </label>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Votre nom"
                        aria-required="true" // Accessibilité
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email" // Type email pour une meilleure validation du navigateur
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="votre@email.com"
                        aria-required="true" // Accessibilité
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de projet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      aria-required="true" // Accessibilité
                    >
                      <option value="">Sélectionnez un service</option>
                      <option value="design">Design Graphique</option>
                      <option value="cv">CV & Documents</option>
                      <option value="web">Développement Web</option>
                      <option value="communication">Communication Digitale</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget estimé
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Sélectionnez une fourchette</option>
                        <option value="<500">Moins de 500€</option>
                        <option value="500-1000">500€ - 1000€</option>
                        <option value="1000-2500">1000€ - 2500€</option>
                        <option value="2500+">Plus de 2500€</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                        Délai souhaité
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Sélectionnez un délai</option>
                        <option value="urgent">Urgent (&lt; 1 semaine)</option>
                        <option value="normal">Normal (1-4 semaines)</option>
                        <option value="flexible">Flexible (1-3 mois)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Description du projet *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Décrivez votre projet en détail..."
                      aria-required="true" // Accessibilité
                    ></textarea>
                  </div>

                  {/* Message d'erreur (si la soumission échoue ou validation client) */}
                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {submissionError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting} // Désactive le bouton pendant la soumission
                  >
                    {isSubmitting ? (
                      <>
                        Envoi en cours...
                        {/* Optionnel : un spinner de chargement */}
                        <svg className="animate-spin h-5 w-5 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Informations de contact et FAQ */}
          <div className="space-y-8">
            {/* Infos de contact */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Informations de contact
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                      <p className="text-gray-900 font-medium">{info.value}</p>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Questions fréquentes
              </h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-start">
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed ml-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Temps de réponse */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Temps de réponse
                </h3>
              </div>
              <p className="text-gray-600">
                Je m'engage à répondre à tous les messages dans les
                <span className="font-semibold text-blue-600"> 24 heures</span> suivant leur réception.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;