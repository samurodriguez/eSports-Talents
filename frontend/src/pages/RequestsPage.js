import { useState } from 'react';
import useRemoteRequests from '../hooks/useRemoteRequests';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import List from '../components/List';
import RequestHeader from '../components/RequestHeader';
import RequestContent from '../components/RequestContent';
import RedirectIfNotLoggedIn from '../components/RedirectIfNotLoggedIn';

const RequestsPage = (props) => {
  const [requests] = useRemoteRequests();
  const [selectedRequest, setSelectedRequest] = useState('');

  return (
    <>
      <RedirectIfNotLoggedIn />
      <FixedBar />
      <main>
        <section className="requests">
          {requests.length < 1 ? (
            <p className={'emptyRequests'}>No hay solicitudes de contratación</p>
          ) : (
            <>
              <List
                className={'requestsList'}
                data={requests}
                render={(request) => (
                  <RequestHeader
                    key={`${request.scout_id}0${request.player_id}`}
                    scoutId={request.scout_id}
                    playerId={request.player_id}
                    avatar={request.usr_photo}
                    name={request.usr_name}
                    lastname={request.usr_lastname}
                    title={request.req_title}
                    setSelectedRequest={setSelectedRequest}
                  />
                )}
              />
              {selectedRequest && (
                <RequestContent
                  scoutId={selectedRequest.scout_id}
                  playerId={selectedRequest.player_id}
                  title={selectedRequest.req_title}
                  content={selectedRequest.req_content}
                  status={selectedRequest.req_status}
                />
              )}
            </>
          )}
        </section>
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default RequestsPage;
